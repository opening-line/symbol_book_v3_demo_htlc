import { Link } from "react-router-dom"

const BobSideMenu: React.FC = () => {
  return (
    <nav className='side-menu'>
      <ul>
        <li>
          <Link to='/bob/setup'>セットアップ</Link>
        </li>
        <li>
          <Link to='/bob/ethlockwait'>①ETHロック待ち</Link>
        </li>
        <li>
          <Link to='/bob/xymlock'>②XYMロック</Link>
        </li>
        <li>
          <Link to='/bob/xymunlockwait'>③XYMロック解除待ち</Link>
        </li>
        <li>
          <Link to='/bob/ethunlock'>④ETHロック解除</Link>
        </li>
        <li>
          <Link to='/bob/finish'>完了</Link>
        </li>
      </ul>
    </nav>
  )
}

export default BobSideMenu
