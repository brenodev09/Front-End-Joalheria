import { Outlet } from "react-router-dom";
import SideBar from "../components/Admin/SideBar"
import Header from "../components/Admin/Header"
import style from "../styles/Admin/layoutAdmin.module.css"

export default function AdminLayout() {
    return(
        <div className={style.containerLayout}>
            <SideBar/>

            <main className={style.main}>
                <Header/>

                <div className={style.content}>
                    <Outlet/>
                </div>
            </main>
        </div>
    )
}