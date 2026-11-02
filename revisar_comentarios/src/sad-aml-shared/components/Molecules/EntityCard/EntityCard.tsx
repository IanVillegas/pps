import style from '@/sad-aml-shared/components/Molecules/EntityCard/EntityCard.module.scss';
import {
  Card,
  Picture,
  Title,
  SubtitleText,
  TextInformation,
  Icon,
} from '@/sad-aml-shared/components/Atoms';

interface EntityCardProps {
  favoriteLogo?: boolean;
  mediaElement: string;
  leftBorderColor?: string;
  title?: string;
  subtitle?: string;
  textInformation?: string;
  className?: string;
  isIcon?: boolean;
  onClick?: () => void;
  favoriteClicked?: () => void;
}

const EntityCard = ({
  favoriteLogo,
  mediaElement,
  leftBorderColor,
  title,
  subtitle,
  textInformation,
  className,
  isIcon,
  onClick,
  favoriteClicked,
}: EntityCardProps) => {
  return (
    <Card
      width={'100%'}
      height={'auto'}
      padding={16}
      leftBorderColor={leftBorderColor}
      onClick={onClick}
    >
      <div className={style.mediaContainer}>
        {isIcon ? (
          <Icon
            name={mediaElement}
            size={'100%'}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <Picture
            src={mediaElement}
            alt={title ?? ''}
            height={56}
            width={56}
            className={className}
          />
        )}
        {favoriteLogo !== undefined &&
          (favoriteLogo ? (
            <Icon
              name="ri-heart-3-fill"
              onClick={favoriteClicked}
              size={'20px'}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <Icon
              name="ri-heart-3-line"
              onClick={favoriteClicked}
              size={'20px'}
              style={{ cursor: 'pointer' }}
              color="gray-300"
            />
          ))}
      </div>
      {title && <Title text={title} className={style.title} />}
      {subtitle && (
        <div className={style.title}>
          <SubtitleText text={subtitle} />
        </div>
      )}
      {textInformation && <TextInformation>{textInformation}</TextInformation>}
    </Card>
  );
};

EntityCard.defaultProps = {
  active: false,
  asButton: false,
};

export default EntityCard;
