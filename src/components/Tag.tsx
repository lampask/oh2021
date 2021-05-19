
type ITagProps = {
  name: string
  color: string
};

const Tag: React.FC<ITagProps> = (props) => {
    return (
        <div className="border-2 rounded-full pl-3 pr-3" style={{color: props.color}}>
          <small>{props.name}</small>
        </div>
    );
}

export default Tag;