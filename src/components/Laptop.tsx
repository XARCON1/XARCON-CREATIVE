const rows = [
  ["esc", "", "", "", "", "", "", "", "", "", "", "", "", "◯"],
  ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "−", "+", "⌫"],
  ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "|"],
  ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "return"],
  ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
  ["fn", "ctrl", "opt", "cmd", "space", "cmd", "opt", "←", "↑", "→"],
];

export default function Laptop({ paused: _paused, active: _active }: { paused: boolean; active: boolean }) {
  return (
    <div className="laptop-arrival">
      <div className="laptop laptop-crafted">
        <div className="laptop-lid">
          <span className="laptop-camera" />
          <div className="laptop-display">
            <div className="laptop-film laptop-local-ad">
              <img src="/images/mountain.webp" alt="" />
              <div className="laptop-local-shade" />

              <div className="laptop-film-brand">
                <span>XARCON</span>
                <i>DESDE NICARAGUA</i>
              </div>

              <div className="laptop-local-copy">
                <small>PARA NEGOCIOS QUE QUIEREN DAR EL SIGUIENTE PASO</small>
                <strong>
                  Ideas de aquí.
                  <br />
                  <em>Hechas para crecer.</em>
                </strong>
                <p>Web · sistemas · marca</p>
              </div>

              <div className="laptop-local-proof">
                <span>Trabajo real</span>
                <span>Soluciones a medida</span>
                <b>Nicaragua</b>
              </div>
            </div>
          </div>
          <span className="laptop-screen-label">XARCON / CREATIVE</span>
        </div>

        <div className="laptop-deck">
          <div className="laptop-hinge" />
          <div className="laptop-speaker speaker-left" />
          <div className="laptop-speaker speaker-right" />
          <div className="laptop-keys">
            {rows.map((row, r) => (
              <div className={`keyboard-row row-${r}`} key={r}>
                {row.map((key, i) => (
                  <span
                    key={i}
                    className={
                      key === "space"
                        ? "key-space"
                        : key.length > 2
                          ? "key-wide"
                          : ""
                    }
                  >
                    {key === "space" ? "" : key}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="laptop-trackpad" />
          <div className="laptop-front">
            <i />
            <span />
          </div>
          <div className="laptop-port port-one" />
          <div className="laptop-port port-two" />
        </div>
      </div>
    </div>
  );
}
