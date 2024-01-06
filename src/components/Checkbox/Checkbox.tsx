interface IProps {
    name: string,
    value: boolean,
    updateValue: Function,
    label?: string
}

export default function Checkbox({
    name,
    value = false,
    updateValue = ()=>{},
    label,
}:IProps) {
    // handle checkbox change
    const handleChange = () => {
        updateValue(!value, name);
    };
    // render the checkbox
    return (
        <div className="py-2">
            <input type="checkbox" id={`${name}-checkbox`} name={name} checked={value} onChange={handleChange} />
            {label && <label htmlFor={`${name}-checkbox`}>{label}</label>}
        </div>
    );
}
