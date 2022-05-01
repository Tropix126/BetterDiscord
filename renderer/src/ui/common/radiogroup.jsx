import {React, Utilities} from "modules";

export default class RadioGroup extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.groupRef = React.createRef();
        this.state = {
            selected: this.props.options.find(item => item.value === this.props.value) || null
        };
    }

    onChange(item) {
        if (!item.disabled) {
            this.setState({selected: item});
            if (typeof(this.props.onChange) === "function") this.props.onChange(item.value);
        }
    }

    onKeyDown(event) {
        const {options} = this.props;
        const children = this.groupRef.current.children;
        const index = Array.from(children).indexOf(event.currentTarget);
        const keymap = {
            "ArrowDown": index + 1 >= options.length ? 0 : index + 1,
            "ArrowUp": index - 1 < 0 ? options.length - 1 : index - 1,
            "Home": 0,
            "End": children.length - 1
        }

        if (keymap.hasOwnProperty(event.key)) {
            event.preventDefault();
            children[keymap[event.key]]?.focus();
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.onChange(options[index]);
        }
    }

    render() {
        const {selected} = this.state;

        return <div
            role="radiogroup"
            className={Utilities.joinClassNames("bd-radio-group", {disabled: this.props.disabled})}
            id={this.props.id}
            aria-orientation="vertical"
            aria-disabled={this.props.disabled}
            ref={this.groupRef}
        >
            {this.props.options.map(item => {
                const { label, description, value, disabled, color } = item;
                const isSelected = value === selected?.value;

                return <div
                    style={{ "--bd-radio-item-color": color }}
                    role="radio"
                    key={value}
                    tabIndex={(isSelected && !disabled) ? "0" : "-1"}
                    className={Utilities.joinClassNames("bd-radio-item", {selected: isSelected}, {disabled})}
                    onClick={() => this.onChange(item)}
                    onKeyDown={this.onKeyDown}
                    aria-disabled={disabled}
                    aria-checked={value === selected?.value}
                >
                    <svg className="bd-radio-icon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                        <path className="bd-radio-icon-ring" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                        <circle cx="12" cy="12" r="5" class="bd-radio-icon-foreground" fill="currentColor" />
                    </svg>
                    <div class="bd-radio-item-info">
                        {label}
                        {description && <p className="bd-radio-item-description">{description}</p>}
                    </div>
                </div>
            })}
        </div>
    }
}