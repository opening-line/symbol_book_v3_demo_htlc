import { SideMenu, SideMenuItem } from "./SideMenu.tsx"

const BobSideMenu: React.FC = () => {
  const menuItems: SideMenuItem[] = [
    { to: "/bob/setup", label: "セットアップ" },
    { to: "/bob/ethlockwait", label: "①ETHロック待ち" },
    { to: "/bob/xymlock", label: "②XYMロック" },
    { to: "/bob/xymunlockwait", label: "③XYMロック解除待ち" },
    { to: "/bob/ethunlock", label: "④ETHロック解除" },
    { to: "/bob/finish", label: "完了" },
  ]
  return <SideMenu menuItems={menuItems} />
}

export default BobSideMenu
