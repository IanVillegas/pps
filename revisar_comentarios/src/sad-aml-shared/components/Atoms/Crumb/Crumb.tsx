import Link from 'next/link';
import style from './Crumb.module.scss';

const Crumb = ({
  text,
  href,
  last = false,
}: {
  text: string;
  href: string;
  last?: boolean;
}) => {
  if (last) {
    return <span className={style.crumb_last}>{text}</span>;
  }
  return (
    <Link className={style.crumb} href={href}>
      {text} /{' '}
    </Link>
  );
};

export default Crumb;
