import {React} from "modules";
import {DownArrow} from "icons";

export default class Select extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.onOuterClick = this.onOuterClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        
        this.uid = Math.random().toString(36).substr(2, 9);

        this.dropdown = React.createRef();
        this.state = {open: false, value: this.props.hasOwnProperty("value") ? this.props.value : this.props.options[0].value};
    }

    showMenu(event) {
        event.preventDefault();

        this.setState({open: !this.state.open}, () => {
            if (!this.state.open) return;
            document.addEventListener("click", this.onOuterClick);
        });
    }

    hideMenu() {
        this.setState({open: false}, () => {
            document.removeEventListener("click", this.onOuterClick);
        });
    }

    onOuterClick(event) {
        if (!this.dropdown.current?.contains(event.target)) this.hideMenu(event);
    }

    onChange(value) {
        this.setState({value});
        if (this.props.onChange) this.props.onChange(value);
    }

    onKeyDown(event) {
        const {key} = event;
        const {options} = this.props;

        const keymap = {
            "ArrowDown": options[options.indexOf(this.selected) + 1 >= options.length ? 0 : options.indexOf(this.selected) + 1],
            "ArrowUp": options[options.indexOf(this.selected) - 1 < 0 ? options.length - 1 : options.indexOf(this.selected) - 1],
            "Home": options[0],
            "End": options[options.length - 1]
        }
        
        if (!this.state.open && key === "ArrowDown") this.showMenu(event);
        if (keymap[key]) {
            event.preventDefault();
            this.onChange(keymap[key].value);
        }
        else if (this.state.open && (key === "Escape" || key === "Enter" || key === "Tab" || key === " ")) {
            if (key === "Enter" || key === " ") event.preventDefault();
            event.stopPropagation();
            this.hideMenu(event);
        }
    }

    get selected() {return this.props.options.find(o => o.value == this.state.value);}

    get options() {
        return <ul
            id={`bd-select-${this.uid}-options`}
            role="listbox"
            className="bd-select-options"
            aria-orientation="vertical"
            aria-activedescendant={`bd-select-${this.uid}-option-${this.props.options.indexOf(this.selected)}`}
        >
            {this.props.options.map(({label, value}, index) =>
                <li
                    role="option"
                    id={`bd-select-${this.uid}-option-${index}`}
                    className={`bd-select-option${this.selected?.value === value ? " selected" : ""}`}
                    onClick={this.onChange.bind(this, value)}
                    aria-selected={this.selected?.value === value}
                >
                    {label}
                </li>
            )}
        </ul>;
    }

    render() {
        const style = this.props.style === "transparent" ? " bd-select-transparent" : "";
        const isOpen = this.state.open ? " menu-open" : "";
        return <button
            ref={this.dropdown}
            tabIndex="0"
            onKeyDown={this.onKeyDown}
            className={`bd-select${style}${isOpen}`}
            onClick={this.showMenu}
            aria-haspopup="listbox"
            aria-expanded={this.state.open}
            aria-controls={`bd-select-${this.uid}-options`}
        >
            <span className={`bd-select-label bd-select-${this.selected ? "value" : "placeholder"}`}>
                {this.selected ? this.selected.label : this.props.placeholder}
            </span>
            <DownArrow size={16} className="bd-select-arrow" />
            {this.state.open && this.options}
        </button>;
    }
}