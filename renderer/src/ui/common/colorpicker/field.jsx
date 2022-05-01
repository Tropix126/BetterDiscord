import {React} from "modules";

import TextInput from "../textinput";

export default class ColorField extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.state = {
            value: props.value,
            isFocused: false
        }
    }
    
    onChange(event) {
        this.setState({value: event.target.value});
        if (this.props.validator(event.target.value)) {
            if (typeof(this.props.onChange) === "function") this.props.onChange(event);
        }
    }

    onBlur(event) {
        this.setState({ isFocused: false });
        if (!this.props.validator(this.state.value)) {
            this.setState({value: this.props.value});
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value && !this.state.isFocused) {
            this.setState({value: this.props.value});
        }
    }

    render() {
        return <label className="bd-color-picker-field-label">
            <TextInput
                size="mini"
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                type={this.props.type}
                value={this.state.value}
                onChange={this.onChange}
                onFocus={() => this.setState({ isFocused: true })}
                onBlur={this.onBlur}
            />
            {this.props.label}
        </label>
    }
}