import { React, Utilities, WebpackModules } from "modules";
import { Dropper, Unfold } from "icons";
import {validateHex, validateRgba, validateHsla, rgbaToHex, rgbaToHsva, hsvaToHex, hexToHsva, hsvaToRgba, hsvaToHsla, hslaToHsva} from "./utils";

import ColorSwatch from "./swatch";
import ColorField from "./field";
import Slider from "../slider";

export default class ColorPickerPopout extends React.Component {
    constructor(props) {
        super(props);

        this.setColor = this.setColor.bind(this);
        this.switchFormat = this.switchFormat.bind(this);
        this.handleHueChange = this.handleHueChange.bind(this);
        this.handleAlphaChange = this.handleAlphaChange.bind(this);
        this.handleMapMove = this.handleMapMove.bind(this);
        this.handleMapMouseDown = this.handleMapMouseDown.bind(this);
        this.handleMapKeyDown = this.handleMapKeyDown.bind(this);
        this.addDocumentListeners = this.addDocumentListeners.bind(this);
        this.removeDocumentListeners = this.removeDocumentListeners.bind(this);
        this.handleHexFieldChange = this.handleHexFieldChange.bind(this);
        this.handleRgbaFieldChange = this.handleRgbaFieldChange.bind(this);
        this.handleHslaFieldChange = this.handleHslaFieldChange.bind(this);

        this.initialParsedColor = props.value ? Utilities.parseColor(this.props.value) : [0, 0, 0, 1];
        
        this.mapRef = React.createRef();
        this.state = {
            hsva: rgbaToHsva(this.initialParsedColor),
            hex: rgbaToHex(this.initialParsedColor),
            rgba: this.initialParsedColor,
            hsla: hsvaToHsla(rgbaToHsva(this.initialParsedColor)),
            format: props.format ?? "hex"
        }
    }

    get swatches() {
        // cherry picked from devtools' material palette
        return this.props.swatches ?? [
            "#f44336",
            "#e91e63",
            "#9c27b0",
            "#673ab7",
            "#3f51b5",
            "#2196f3",
            "#03a9f4",
            "#00bcd4",
            "#009688",
            "#4caf50",
            "#8bc34a",
            "#cddc39",
            "#ffeb3b",
            "#ffc107",
            "#ff9800",
            "#ff5722"
        ];
    }

    switchFormat() {
        this.setState({
            format: this.state.format === "hex" ? "rgba" : this.state.format === "rgba" ? "hsla" : "hex"
        });
    }

    setColor(color) {
        this.setState({
            hsva: rgbaToHsva(Utilities.parseColor(color))
        });
    }

    handleMapMove(event) {
        const { width, height, top, left } = this.mapRef.current.getBoundingClientRect();
        const s = Utilities.clamp(((event.clientX - left) / width) * 100, 0, 100);
        const v = Utilities.clamp(100 - ((event.clientY - top) / height) * 100, 0, 100);

        this.setState({
            hsva: [Utilities.round(this.state.hsva[0]), Utilities.round(s), Utilities.round(v), this.state.hsva[3]]
        });
    }

    handleMapKeyDown(event) {
        const [h, s, v, a] = this.state.hsva;
        const keymap = {
            ArrowUp: 1,
            ArrowRight: 1,
            ArrowDown: -1,
            ArrowLeft: -1
        }

        if (keymap[event.key]) event.preventDefault();
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            this.setState({
                hsva: [h, s, Utilities.clamp(v + keymap[event.key], 0, 100), a]
            });
        } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            this.setState({
                hsva: [h, Utilities.clamp(s + keymap[event.key], 0, 100), v, a]
            });
        }
    }

    handleMapMouseDown(event) {
        this.handleMapMove(event);
        this.addDocumentListeners();
    }

    addDocumentListeners() {
        document.addEventListener("mousemove", this.handleMapMove);
        document.addEventListener("mouseup", this.removeDocumentListeners);
    }

    removeDocumentListeners() {
        document.removeEventListener("mousemove", this.handleMapMove);
        document.removeEventListener("mouseup", this.removeDocumentListeners);
    }

    handleHueChange(value) {
        const [h, s, v, a] = this.state.hsva;
        this.setState({
            hsva: [value, s, v, a]
        });
    }

    handleAlphaChange(value) {
        const [h, s, v, a] = this.state.hsva;
        this.setState({
            hsva: [h, s, v, value / 100]
        });
    }

    handleHexFieldChange({target: {value}}) {
        this.setState({
            hsva: hexToHsva(value)
        });
    }

    handleRgbaFieldChange(index, value) {
        const rgba = this.state.rgba;
        rgba[index] = value;
        this.setState({
            hsva: rgbaToHsva(rgba)
        });
    }

    handleHslaFieldChange(index, value) {
        const hsla = this.state.hsla;
        hsla[index] = parseInt(value);
        this.setState({
            hsva: hslaToHsva(hsla)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.hsva !== this.state.hsva || prevState.format !== this.state.format) {
            this.setState(({hsva}) => ({
                hex: hsvaToHex(hsva),
                rgba: hsvaToRgba(hsva),
                hsla: hsvaToHsla(hsva)
            }), () => {
                if (typeof(this.props.onChange) === "function") {
                    let finalString = "";
                    if (this.state.format === "hex") {
                        finalString = this.state.hex;
                    }
                    else if (this.state.format === "rgba") {
                        const [r, g, b, a] = this.state.rgba;
                        finalString = `rgba(${r}, ${g}, ${b}, ${a})`;
                    }
                    else if (this.state.format === "hsla") {
                        const [h, s, l, a] = this.state.hsla;
                        finalString = `hsla(${h}, ${s}%, ${l}%, ${a})`;
                    }
                    this.props.onChange(finalString);
                }
            });
        }
    }

    render() {
        const [h, s, l, a] = this.state.hsla;
        const [r, g, b] = this.state.rgba;

        return <div
            id={this.props.id}
            onClick={this.props.onClick}
            role="dialog"
            aria-modal="true"
            className="bd-color-picker-popout"
            style={{
            "--bd-color-picker-hue": h,
            "--bd-color-picker-saturation": `${s}%`,
            "--bd-color-picker-lightness": `${l}%`,
            "--bd-color-picker-alpha": `${a}`
        }}>
            <div
                ref={this.mapRef}
                className="bd-color-picker-map"
                tabIndex="0"
                role="slider"
                aria-valuetext={`Saturation ${this.state.hsva[1]}%, Brightness ${this.state.hsva[2]}%`}
                onMouseDown={this.handleMapMouseDown}
                onKeyDown={this.handleMapKeyDown}
            >
                <div
                    aria-label="Color"
                    className="bd-color-picker-pointer"
                    style={{
                        left: `${this.state.hsva[1]}%`,
                        top: `${-this.state.hsva[2] + 100}%`
                    }}
                >
                </div>
            </div>
            <div className="bd-color-picker-body">
                <section className="bd-color-picker-controls">
                    <div className="bd-color-picker-preview">
                        <Dropper className="bd-color-picker-dropper" size={14} />
                    </div>
                    <div className="bd-color-picker-sliders">
                        <Slider
                            mini
                            className="bd-color-picker-hue-slider"
                            min={0}
                            max={360}
                            value={Utilities.round(this.state.hsva[0])}
                            tooltip={v => v + "°"}
                            onChange={this.handleHueChange}
                        />
                        <Slider
                            mini
                            className="bd-color-picker-alpha-slider"
                            min={0}
                            max={100}
                            value={this.state.hsva[3] * 100}
                            tooltip={v => v + "%"}
                            onChange={this.handleAlphaChange}
                        />
                    </div>
                </section>
                <section className="bd-color-picker-fields">
                    {this.state.format === "hex" ?
                        <ColorField
                            onBlur={this.handleHexFieldBlur}
                            onChange={this.handleHexFieldChange}
                            value={this.state.hex}
                            validator={validateHex}
                            label="HEX"
                        />
                        : this.state.format === "rgba" ?
                            <>
                                <ColorField
                                    type="number"
                                    min={0}
                                    max={255}
                                    step={1}
                                    value={r}
                                    validator={_ => validateRgba([parseInt(_), g, b, a])}
                                    onChange={event => this.handleRgbaFieldChange(0, event.target.valueAsNumber)}
                                    label="R"
                                />
                                <ColorField
                                    type="number"
                                    min={0}
                                    max={255}
                                    step={1}
                                    value={g}
                                    validator={_ => validateRgba([r, parseInt(_), b, a])}
                                    onChange={event => this.handleRgbaFieldChange(1, event.target.valueAsNumber)}
                                    label="G"
                                />
                                <ColorField
                                    type="number"
                                    min={0}
                                    max={255}
                                    step={1}
                                    value={b}
                                    validator={_ => validateRgba([r, g, parseInt(_), a])}
                                    onChange={event => this.handleRgbaFieldChange(2, event.target.valueAsNumber)}
                                    label="B"
                                />
                                <ColorField
                                    type="number"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={a}
                                    validator={_ => validateRgba([r, g, b, parseInt(_)])}
                                    onChange={event => this.handleRgbaFieldChange(3, event.target.valueAsNumber)}
                                    label="A"
                                />
                            </>
                            : this.state.format === "hsla" ?
                                <>
                                    <ColorField
                                        type="number"
                                        min={0}
                                        max={360}
                                        value={h}
                                        validator={_ => validateHsla([parseInt(_), s, l, a])}
                                        onChange={event => this.handleHslaFieldChange(0, event.target.valueAsNumber)}
                                        label="H"
                                    />
                                    <ColorField
                                        value={`${s}%`}
                                        validator={_ => validateHsla([h, parseInt(_), l, a])}
                                        onChange={event => this.handleHslaFieldChange(1, event.target.value)}
                                        label="S"
                                    />
                                    <ColorField
                                        value={`${l}%`}
                                        validator={_ => validateHsla([h, s, parseInt(_), a])}
                                        onChange={event => this.handleHslaFieldChange(2, event.target.value)}
                                        label="L"
                                    />
                                    <ColorField
                                        type="number"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={this.state.rgba[3]}
                                        validator={_ => validateHsla([h, s, l, parseInt(_)])}
                                        onChange={event => this.handleHslaFieldChange(3, event.target.valueAsNumber)}
                                        label="A"
                                    />
                                </>
                                : null
                    }
                    <button className="bd-color-picker-format-button" onClick={this.switchFormat}>
                        <Unfold size={16} />
                    </button>
                </section>
                {this.swatches.length &&
                    <section className="bd-color-picker-swatches">
                        {this.swatches.map(color => (
                            <ColorSwatch
                                onClick={() => this.setColor(color)}
                                color={color}
                            />
                        ))}
                    </section>
                }
            </div>
        </div>
    }
}