import {React} from "modules";
import {Dropper} from "icons";
import Popout from "./popout";

export default class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        
        this.onChange = this.onChange.bind(this);
        this.showPopout = this.showPopout.bind(this);
        this.hidePopout = this.hidePopout.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.removeDocumentListeners = this.removeDocumentListeners.bind(this);

        this.uid = Math.random().toString(36).substr(2, 9);
        this.buttonRef = React.createRef();
        this.state = {
            value: props.value || "rgba(0, 0, 0, 1)",
            open: false
        };
    }

    removeDocumentListeners() {
        document.removeEventListener("click", this.hidePopout);
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    showPopout(event) {
        this.setState({open: !this.state.open}, () => {
            if (this.state.open) {
                document.addEventListener("click", this.hidePopout);
                document.addEventListener("keydown", this.handleKeyDown);
            }
        });
    }

    hidePopout(event) {
        if (!this.buttonRef.current.contains(event.target)) {
            this.setState({open: false}, () => {
                this.removeDocumentListeners();
            });
        }
    }

    handleKeyDown(event) {
        if (event.key === "Escape") {
            event.stopPropagation();
            this.setState({open: false}, () => {
                this.removeDocumentListeners();
            });
        }
    }

    onChange(value) {
        this.setState({value});
        if (this.props.onChange) this.props.onChange(value);
    }

    componentWillUnmount() {
        this.removeDocumentListeners();
    }

    render() {
        return <button
            ref={this.buttonRef}
            aria-controls={`bd-color-picker-popout-${this.uid}`}
            aria-expanded={open}
            onClick={this.showPopout}
            className="bd-color-picker"
            role="button"
            tabIndex="0"
            style={{ backgroundColor: this.state.value }}
        >
            <Dropper className="bd-color-picker-dropper" size={14} />
            {this.state.open &&
                <Popout
                    id={`bd-color-picker-popout-${this.uid}`}
                    onClick={e => e.stopPropagation()}
                    onChange={this.onChange}
                    value={this.state.value}
                />
            }
        </button>;
    }
}