import {  FolderKanban } from "lucide-react"
import { Link } from "react-router-dom"
import { LoginForm } from "@/components/login-form"
import loginImage from "@/assets/login.jpg"
import { motion } from "framer-motion"
export default function Signin() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2 bg-muted">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link to="/" className="flex items-center gap-2 font-medium">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="group flex items-center gap-2.5 rounded-lg p-1 -ml-1 cursor-pointer"
                        >
                            <div className="relative">
                                <motion.div
                                    whileHover={{ rotate: 45 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                >
                                    <FolderKanban className="h-7 w-7 text-white transition-transform sm:h-8 sm:w-8 bg-primary p-1.5 rounded-lg" />
                                </motion.div>
                            </div>
                            <span className="text-xl font-bold sm:text-2xl">
                                <span className="text-gray-900">Ethara</span>
                                <span className="text-primary">AI</span>
                            </span>
                        </motion.div>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center ">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src={loginImage}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
