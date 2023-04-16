import styles from './styles/card.module.sass'

type CardProps = {
  children: string | JSX.Element | JSX.Element[]
  title: string | JSX.Element
}

const Card = ({ children, title }: CardProps) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.card__title}>{title}</h2>
      {children}
    </div>
  )
}

export default Card