import { Outlet } from "react-router-dom";
import SideBar from "../components/User/SideBarLayout"
import Header from "../components/Header";
import style from "../styles/User/userLayout.module.css"


export default function UserLayout() {

    return (

        <div className={style.containerLayout}>
            <SideBar />

            <main className={style.main}>
                <Header />

                <div className={style.content}>
                    <Outlet />
                </div>
            </main>


        </div>

    )

}