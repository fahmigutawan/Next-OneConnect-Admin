"use client"

import { Button, TextField } from "@mui/material";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-[16px]">
            <div className="flex flex-col items-center">
                <p className="text-[32px]">
                    Selamat Datang
                </p>
                <p>
                    Masuk menggunakan akun Admin anda
                </p>
            </div>

            <TextField
                label="Email"
                variant="outlined"
                size="small"
                className="w-96"
            />

            <TextField
                label="Password"
                variant="outlined"
                size="small"
                className="w-96"
                type="password"
            />

            <Button
                variant="contained"
                color="primary"
                className="bg-blue-500 w-96"
                onClick={() => { /** TODO */ }}
            >
                Masuk
            </Button>
        </div>
    )
}