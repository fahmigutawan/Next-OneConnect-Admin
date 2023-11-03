import { CallStatus } from "@/constant/call_status"
import { Button } from "@mui/material"

type CallStatusActionProps = {
    call_status_id: string,
    em_transport_id: string,
    onProsesPanggilanClick: () => void,
    onKirimPetugasClick: () => void,
    onLihatPetugasClick: () => void
}


export const CallStatusAction: React.FC<CallStatusActionProps> = ({
    call_status_id = "",
    em_transport_id = "",
    onProsesPanggilanClick = () => { },
    onKirimPetugasClick = () => { },
    onLihatPetugasClick = () => { }
}) => {

    switch (call_status_id) {
        case CallStatus.MENUNGGU_KONFIRMASI:
            return <Button variant="contained" className="w-full bg-blue-500" onClick={onProsesPanggilanClick}>Proses Panggilan</Button>
        case CallStatus.DIPROSES: {
            if (em_transport_id == ".") {
                return <Button variant="contained" className="w-full bg-yellow-600" onClick={onKirimPetugasClick}>Kirim Petugas</Button>
            } else {
                return <Button variant="contained" className="w-full bg-lime-600" onClick={onLihatPetugasClick}>Lihat Petugas</Button>
            }
        }

        case CallStatus.SEDANG_PERJALANAN:
            return <div></div>
        case CallStatus.SELESAI:
            return <div></div>
        case CallStatus.DIBATALKAN:
            return <div></div>
        default:
            return <div></div>
    }
}