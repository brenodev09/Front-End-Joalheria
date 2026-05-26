import style from "../../styles/Admin/dashboard.module.css"
import SideBar from "../../components/Admin/SideBar"
import HeaderAdmin from "../../components/Admin/Header"

export default function Dashboard() {
    return(
        <>
            <HeaderAdmin/>
            <SideBar/>
        </>
    )
}