import type { AdaptedUser } from '@/types/HomePage.types';
import styles from './Dummy.module.scss';
import { Button } from '@/sad-aml-shared/components/Atoms';

type HomePageProps = {
  users: AdaptedUser;
};

const Dummy = ({ users }: HomePageProps) => {
  return (
    <div>
      <h2>Títulos</h2>
      <ul className={styles.list}>
        <li>
          <h3 className={styles.worksansThin}>Worksans Thin</h3>
        </li>
        <li>
          <h3 className={styles.worksansLight}>Worksans Light</h3>
        </li>
        <li>
          <h3 className={styles.worksansRegular}>Worksans Regular</h3>
        </li>
        <li>
          <h3 className={styles.worksansMedium}>Worksans Medium</h3>
        </li>
        <li>
          <h3 className={styles.worksansSemibold}>Worksans Semibold</h3>
        </li>
        <li>
          <h3 className={styles.worksansBold}>Worksans Bold</h3>
        </li>
        <li>
          <h3 className={styles.worksansBlack}>Worksans Black</h3>
        </li>
        <li>
          <h3 className={styles.worksansItalic}>Worksans Italic</h3>
        </li>
      </ul>
      <hr />
      <h2>Párrafos</h2>
      <ul className={styles.list}>
        <li>
          <h3 className={styles.poppinsThin}>Poppins Thin</h3>
        </li>
        <li>
          <h3 className={styles.poppinsLight}>Poppins Light</h3>
        </li>
        <li>
          <h3 className={styles.poppinsRegular}>Poppins Regular</h3>
        </li>
        <li>
          <h3 className={styles.poppinsMedium}>Poppins Medium</h3>
        </li>
        <li>
          <h3 className={styles.poppinsSemibold}>Poppins Semibold</h3>
        </li>
        <li>
          <h3 className={styles.poppinsBold}>Poppins Bold</h3>
        </li>
        <li>
          <h3 className={styles.poppinsBlack}>Poppins Black</h3>
        </li>
        <li>
          <h3 className={styles.poppinsItalic}>Poppins Italic</h3>
        </li>
      </ul>
      <hr />
      <h2>Renderizado de información de una api</h2>
      <p>{users.fullName}</p>
      <hr />
      <h2>Botones</h2>
      <ul className={styles.list}>
        <li>
          <Button text="auto" size="auto" />
        </li>
        <li>
          <Button text="small" size="small" />
        </li>
        <li>
          <Button text="x-small" size="x-small" />
        </li>
        <li>
          <Button text="medium" size="medium" />
        </li>
        <li>
          <Button text="mediumCard" size="mediumCard" />
        </li>
        <li>
          <Button text="doubleOption" size="doubleOption" />
        </li>
        <li>
          <Button text="mediumL" size="mediumL" />
        </li>
        <li>
          <Button text="largeCard" size="largeCard" />
        </li>
        <li>
          <Button text="large" size="large" />
        </li>
        <li>
          <Button text="longer" size="longer" />
        </li>
      </ul>
    </div>
  );
};

export default Dummy;
