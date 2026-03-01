import os
import subprocess
import uuid
from pathlib import Path

import pdfplumber

from utils.get_env import get_temp_directory_env


class DoclingService:
    def __init__(self):
        self._docling_converter = None

        try:
            from docling.document_converter import (
                DocumentConverter,
                PdfFormatOption,
                PowerpointFormatOption,
                WordFormatOption,
            )
            from docling.datamodel.pipeline_options import PdfPipelineOptions
            from docling.datamodel.base_models import InputFormat

            pipeline_options = PdfPipelineOptions()
            pipeline_options.do_ocr = False

            self._docling_converter = DocumentConverter(
                allowed_formats=[InputFormat.PPTX, InputFormat.PDF, InputFormat.DOCX],
                format_options={
                    InputFormat.DOCX: WordFormatOption(pipeline_options=pipeline_options),
                    InputFormat.PPTX: PowerpointFormatOption(
                        pipeline_options=pipeline_options,
                    ),
                    InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options),
                },
            )
        except Exception:
            self._docling_converter = None

    def parse_to_markdown(self, file_path: str) -> str:
        if self._docling_converter is not None:
            result = self._docling_converter.convert(file_path)
            return result.document.export_to_markdown()

        # Fallback (no docling): extract text via pdfplumber / LibreOffice conversion
        path = Path(file_path)
        suffix = path.suffix.lower()
        if suffix == ".pdf":
            return self._pdf_to_markdown(path)
        if suffix in {".pptx", ".docx"}:
            return self._office_to_markdown_via_pdf(path)
        return self._plain_text_to_markdown(path)

    @staticmethod
    def _pdf_to_markdown(path: Path) -> str:
        with pdfplumber.open(str(path)) as pdf:
            texts: list[str] = []
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                if page_text.strip():
                    texts.append(page_text.strip())
            return "\n\n".join(texts).strip()

    @staticmethod
    def _plain_text_to_markdown(path: Path) -> str:
        try:
            return path.read_text(encoding="utf-8", errors="ignore").strip()
        except Exception:
            return ""

    @staticmethod
    def _office_to_markdown_via_pdf(path: Path) -> str:
        base_tmp = get_temp_directory_env() or "/tmp/SWAGSlides"
        out_dir = Path(base_tmp) / "office_convert" / str(uuid.uuid4())
        out_dir.mkdir(parents=True, exist_ok=True)

        # LibreOffice headless conversion: input -> PDF
        # Note: `soffice` is provided by the `libreoffice` package in Debian.
        cmd = [
            "soffice",
            "--headless",
            "--nologo",
            "--nofirststartwizard",
            "--convert-to",
            "pdf",
            "--outdir",
            str(out_dir),
            str(path),
        ]
        subprocess.run(cmd, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        pdf_path = out_dir / f"{path.stem}.pdf"
        if not pdf_path.exists():
            # Some LO versions normalize filenames; fallback to first PDF in dir
            pdfs = list(out_dir.glob("*.pdf"))
            if not pdfs:
                return ""
            pdf_path = pdfs[0]

        text = DoclingService._pdf_to_markdown(pdf_path)

        # Best-effort cleanup
        try:
            for p in out_dir.glob("*"):
                try:
                    p.unlink()
                except Exception:
                    pass
            out_dir.rmdir()
        except Exception:
            pass

        return text.strip()
