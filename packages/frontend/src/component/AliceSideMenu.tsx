import { SideMenu, SideMenuItem } from "./SideMenu"

const AliceSideMenu: React.FC = () => {
  const menuItems: SideMenuItem[] = [
    { to: "/alice/setup", label: "セットアップ" },
    { to: "/alice/ethlock", label: "①ETHロック" },
    { to: "/alice/xymlockwait", label: "②XYMロック待ち" },
    { to: "/alice/xymunlock", label: "③XYMロック解除" },
    { to: "/alice/finish", label: "完了" },
  ]

  return <SideMenu menuItems={menuItems} />
}

export default AliceSideMenu
