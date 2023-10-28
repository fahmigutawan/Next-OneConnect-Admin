"use client"

import { Repository } from "@/data/repository"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export interface EmCallStruct {
    em_call_id: string,
    em_call_status_id: string,
    em_pvd_id: string,
    created_at: number
}

export interface EmProviderStruct {
    em_pvd_id: string,
    name: string,
    em_type: string
}

export interface EmTypeStruct {
    em_type_id: string,
    word: string
}

export default function DashboardScreen() {
    const params = useParams()
    const id = params.id.toString()
    const repository = new Repository()
    const [datas, setDatas] = useState<EmCallStruct[]>([])
    const [emPvd, setEmPvd] = useState<EmProviderStruct>({
        em_pvd_id: "",
        em_type: "",
        name: ""
    })
    const [emType, setEmType] = useState<EmTypeStruct>({
        em_type_id: "",
        word: ""
    })

    useEffect(() => {
        // repository.listenEmergencyCall(
        //     id,
        //     (snapshot) => {
        //         setDatas(
        //             Object
        //                 .values<EmCallStruct>(snapshot.val())
        //                 .map((value) => {
        //                     return value
        //                 })
        //                 .sort((a, b) => {
        //                     return a.created_at - b.created_at
        //                 })
        //         )
        //     }
        // )

        repository.getEmProviderById(
            id,
            (s) => {
                setEmPvd(s)
            }
        )
    }, [])

    useEffect(() => {
        if (emPvd.em_pvd_id != "") {
            repository.getEmType(
                emPvd.em_pvd_id,
                (s) => {
                    setEmType(s)
                }
            )
        }
    }, [emPvd])

    return (
        <div className="h-screen bg-slate-200">
            <div className="flex justify-end items-center w-full h-[96px] bg-slate-300">
                <div className="flex flex-col px-[32px] items-end">
                    <p className="text-[32px]">{emPvd.name}</p>
                    <p>{emType.word}</p>
                </div>
            </div>
        </div>
    )
}