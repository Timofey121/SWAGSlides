import React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
            <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8">
                <img
                    src="/404.svg"
                    alt="Page not found"
                    className="w-3/4 mx-auto mb-6"
                />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Страница не найдена
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                    Похоже, вы открыли страницу, которой не существует. Ничего страшного — любая презентация начинается с пустого слайда.
                </p>

                <div className="flex justify-center space-x-4 mb-8">
                    <Link href="/upload">
                        <Button className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90">
                            На главную
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default NotFound;