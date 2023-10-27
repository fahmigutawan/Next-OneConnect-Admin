"use client"

import { Repository } from "@/data/repository"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface EmCallStruct {
    em_call_id: string,
    em_call_status_id: string,
    em_pvd_id: string,
    created_at: number
}

export default function DashboardScreen() {
    const params = useParams()
    const id = params.id.toString()
    const repository = new Repository()
    const [datas, setDatas] = useState<EmCallStruct[]>([])

    useEffect(() => {
        repository.listenEmergencyCall(
            id,
            (snapshot) => {
                setDatas(
                    Object
                        .values<EmCallStruct>(snapshot.val())
                        .map((value) => {
                            return value
                        })
                        .sort((a, b) => {
                            return a.created_at - b.created_at
                        })
                )
            }
        )
    }, [])

    return (
        <div>
            {datas.map((s) => {
                return <div key={s.em_call_id}>{s.em_call_id}</div>
            })}
        </div>
    )
}