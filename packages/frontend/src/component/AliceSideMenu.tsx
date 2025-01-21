import { Link } from "react-router-dom"

const AliceSideMenu: React.FC = () => {
  return (
    <nav className='side-menu'>
      <ul>
        <li>
          <Link to='/alice/setup'>セットアップ</Link>
        </li>
        <li>
          <Link to='/alice/ethlock'>①ETHロック</Link>
        </li>
        <li>
          <Link to='/alice/xymlockwait'>②XYMロック待ち</Link>
        </li>
        <li>
          <Link to='/alice/xymunlock'>③XYMロック解除</Link>
        </li>
        <li>
          <Link to='/alice/finish'>完了</Link>
        </li>
      </ul>
    </nav>
  )
}

export default AliceSideMenu
