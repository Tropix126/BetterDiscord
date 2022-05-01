import {React, WebpackModules} from "modules";

const Tooltip = WebpackModules.getByDisplayName("Tooltip");

export default class ColorSwatch extends React.Component {
    render() {
        return <Tooltip color="primary" position="top" text={this.props.color}>
            {props => <button
                {...props}
                title={this.props.color}
                style={{ "--bd-swatch-color": this.props.color }}
                className="bd-color-picker-swatch"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>
            }
        </Tooltip>
    }
}