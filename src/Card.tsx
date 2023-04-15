type CardProps = {
  children: string | JSX.Element | JSX.Element[]
  title: string | JSX.Element
}

const Card = ({ children, title }: CardProps) => {
  return (
    <div className="card">
      <h2 className="card__title">{title}</h2>
      {children}
    </div>
  )
}

export default Card