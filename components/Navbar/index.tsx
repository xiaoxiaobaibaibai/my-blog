import {useState} from "react";
import type { NextPage} from "next";
import {navs} from "./con";
import Link from 'next/link';
import {useRouter} from "next/router";
import Login from "../Login";
import {Button} from "antd";
import styles from './index.module.scss';

const Navbar: NextPage = () => {
    const { pathname } = useRouter()
    const [isShowLogin, setIsShowLogin] = useState(false);
    const handleGotoEditPage = () => {}
    const handleLogin = () => {
        setIsShowLogin(true)
    }
    const handleClose = () => {
        setIsShowLogin(false)
    }
    return (
        <div className={styles.navbar}>
            <section className={styles.logoArea}>Blog-C</section>
            <section className={styles.linkArea}>
                {
                    navs?.map(nav => (
                        <Link key={nav?.value} href={nav?.value}>
                            <a className={pathname === nav?.value ? styles.active : ''}>{nav?.label}</a>
                        </Link>
                    ))
                }
            </section>
            <section className={styles.optionArea}>
                <Button onClick={handleGotoEditPage}>写文章</Button>
                <Button type="primary" onClick={handleLogin}>登录</Button>
            </section>

            <Login isShow={isShowLogin} onClose={handleClose}></Login>
        </div>
    )
}

export default Navbar;
