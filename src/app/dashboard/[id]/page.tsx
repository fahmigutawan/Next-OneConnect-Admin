"use client"

import { CallStatus } from "@/constant/call_status"
import { EmCallStatus, EmCallStruct, EmProviderStruct, EmTransportStruct, EmTypeStruct, Repository } from "@/data/repository"
import { Box, Button, Modal } from "@mui/material"
import { useParams } from "next/navigation"
import { Loading, Notify } from "notiflix"
import React from "react"
import { Component, ReactNode, useEffect, useState } from "react"

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
    const [emCallStatus, _] = useState(new Map<string, string>())
    const [showKirimPetugasModal, setShowKirimPetugasModal] = useState(false)
    const [emTransport, setEmTransport] = useState<EmTransportStruct[]>([])

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
                            return b.created_at - a.created_at
                        })
                )
            }
        )

        repository.getEmProviderById(
            id,
            (s) => {
                setEmPvd(s)
            }
        )

        repository.getAllCallStatus(
            (s) => {
                s.forEach(item => {
                    emCallStatus.set(
                        item.em_call_status_id,
                        item.word
                    )
                })
            }
        )
    }, [])

    useEffect(() => {
        repository.getEmTrasportById(
            id,
            (datas) => {
                setEmTransport(datas)
            },
        )
    }, [showKirimPetugasModal])

    useEffect(() => {
        if (emPvd.em_pvd_id != "") {
            repository.getEmType(
                emPvd.em_type,
                (s) => {
                    setEmType(s)
                }
            )
        }
    }, [emPvd])

    return (
        <div>
            <div className="h-screen bg-slate-200">
                <div className="flex justify-end items-center w-full h-[96px] bg-slate-300">
                    <div className="flex flex-col px-[32px] items-end">
                        <p className="text-[32px]">{emPvd.name}</p>
                        <p>Kategori : {emType.word}</p>
                    </div>
                </div>
                <div className="flex px-[32px] py-[64px]">

                    <table className="w-screen border border-slate-700">
                        <thead>
                            <tr>
                                <th className="border border-slate-700">No</th>
                                <th className="border border-slate-700">Id Panggilan</th>
                                <th className="border border-slate-700">Waktu Panggilan</th>
                                <th className="border border-slate-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas.map((item, index) => {
                                return (
                                    <tr>
                                        <td className="text-center border border-slate-700 p-[16px]">{index + 1}</td>
                                        <td className="border border-slate-700 p-[16px]">{item.em_call_id}</td>
                                        <td className="border border-slate-700 p-[16px]">{new Date(item.created_at).toString()}</td>
                                        <td className="text-center border border-slate-700 p-[16px]">
                                            <div className="flex flex-col items-center space-y-[16px]">
                                                <p>{emCallStatus.get(item.em_call_status_id) ?? "..."}</p>
                                                <CallStatusAction
                                                    call_status_id={item.em_call_status_id}
                                                    onProsesPanggilanClick={() => {
                                                        Loading.circle()
                                                        repository.changeCallStatus(
                                                            item.em_call_id,
                                                            CallStatus.DIPROSES,
                                                            () => {
                                                                Loading.remove()
                                                                Notify.success(`Status Panggilan ${item.em_call_id} Berhasil Dirubah`)
                                                                datas[index] = {
                                                                    em_call_id: item.em_call_id,
                                                                    em_pvd_id: item.em_pvd_id,
                                                                    em_call_status_id: CallStatus.DIPROSES,
                                                                    created_at: item.created_at
                                                                }
                                                            }
                                                        )
                                                    }}
                                                    onKirimPetugasClick={() => {
                                                        setShowKirimPetugasModal(true)
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                open={showKirimPetugasModal}
                onClose={() => {
                    setShowKirimPetugasModal(false)
                }}
                className="flex justify-center items-center"
            >
                <Box>
                    <div className="m-[128px] p-[32px] overflow-auto flex flex-col items-center justify-center bg-white rounded-sm">
                        <table>
                            <thead>
                                <th className="px-[16px] py-[8px] border border-black">No</th>
                                <th className="px-[16px] py-[8px] border border-black">Id Kendaraan</th>
                                <th className="px-[16px] py-[8px] border border-black">Plat Kendaraan</th>
                                <th className="px-[16px] py-[8px] border border-black">Status</th>
                                <th className="px-[16px] py-[8px] border border-black">Aksi</th>
                            </thead>
                            <tbody>
                                {
                                    emTransport.map((s, index) => {
                                        return (
                                            <tr>
                                                <td className="px-[16px] py-[8px] border border-black text-center">{index + 1}</td>
                                                <td className="px-[16px] py-[8px] border border-black">{s.em_transport_id}</td>
                                                <td className="px-[16px] py-[8px] border border-black text-center">{s.regist_number}</td>
                                                <td className="px-[16px] py-[8px] border border-black text-center">{(s.is_available) ? "Tersedia" : "Tidak Tersedia"}</td>
                                                <td className="px-[16px] py-[8px] border border-black text-center">
                                                    {
                                                        (s.is_available) ?
                                                            <Button variant="contained">
                                                                Tugaskan
                                                            </Button>
                                                            : "-"
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export class CallStatusAction extends React.Component<{
    call_status_id: string,
    onProsesPanggilanClick: () => void,
    onKirimPetugasClick: () => void
}>
{

    render(): ReactNode {
        switch (this.props.call_status_id) {
            case CallStatus.MENUNGGU_KONFIRMASI:
                return <Button variant="contained" className="w-full bg-blue-500" onClick={this.props.onProsesPanggilanClick}>Proses Panggilan</Button>
            case CallStatus.DIPROSES:
                return <Button variant="contained" className="w-full bg-yellow-600" onClick={this.props.onKirimPetugasClick}>Kirim Petugas</Button>
            case CallStatus.SEDANG_PERJALANAN:
                return <></>
            case CallStatus.SELESAI:
                return <></>
            case CallStatus.DIBATALKAN:
                return <></>
        }

        return <></>
    }

}