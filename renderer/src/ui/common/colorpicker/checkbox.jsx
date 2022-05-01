import {React, Utilities} from "modules";
import {Checkmark} from "icons"

export default class Checkbox extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            checked: this.props.checked || false
        };
    }

    render() {
        return <label className={Utilities.joinClassNames("bd-checkbox-wrapper", {reverse: this.props.reverse})}>
            <div
                style={{ "--bd-checkbox-size": `${this.props.size || 24}px` }}
                className={Utilities.joinClassNames("bd-checkbox", this.props.className, {checked: this.state.checked})}
            >
                <input type="checkbox" className="bd-checkbox-input" id={this.props.id} onChange={this.onChange} />
                <Checkmark class="bd-checkbox-checkmark" />
            </div>
            {this.props.children && <span className="bd-checkbox-label">
                {this.props.children}
            </span>}
        </label>;
    }

    onChange(event) {
        this.setState({checked: event.target.checked});
        if (this.props.onChange) this.props.onChange(event.target.checked);
    }
}