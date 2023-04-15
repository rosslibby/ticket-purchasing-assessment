type ColumnProps = {
  children: string | JSX.Element | JSX.Element[]
}

const Column = ({ children }: ColumnProps) => {
  return (
    <div className="column">
      {children}
    </div>
  )
}

export default Column