/**
 * @fixme Running into issues getting CSS working with parcel so for now
 * doing it this way
 */
export default `
.menu-bar_menu-bar-item_scratchmoar {
  padding: 0 !important;
}

.menu-bar_menu-bar-item_scratchmoar > span {
  padding: 0 0.75rem;
  display: inline-block;
  line-height: 2.5rem;
}

.scratchmoarHidden {
  display: none;
}

.scratchmoarPopup {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.scratchmoarPopup > .scratchmoarOverlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.75);
}

.scratchmoarPopup > .scratchmoarPopupContent {
  position: absolute;
  cursor: initial;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--ui-tertiary, #fff);
  max-height: 80%;
  border-radius: 0.5rem;
  padding: 1rem;
  width: 960px;
  max-width: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;
}
.scratchmoarPopupContent {
  color: #000;
}
[theme="dark"] .scratchmoarPopupContent {
  color: #fff;
}

.scratchmoarPopupContentBody {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.scratchmoarPopup button {
  padding: 1rem;
}

.scratchmoarPopupContentBody select {
  width: 100%;
  display: block;
}

.scratchmoarPopupContentBody table {
  width: 100%;
  text-align: left;
}

.scratchmoarPopupContentBody table td,
.scratchmoarPopupContentBody table th {
  padding: 1em;
  border: 1px solid #aaa;
}
.scratchmoarPopupContentBody table th {
  background: #999a;
}
.scratchmoarPopupContentBody table tr:hover {
  background: #eeea
}

.scratchmoarInfo {
  background: #00a9;
}
.scratchmoarPositive {
  background: #0a09;
}
.scratchmoarWarning {
  background: #f809;
}
.scratchmoarNegative {
  background: #f009;
}

.scratchmoar-favicon {
  background-size: contain;
  background-repeat: no-repeat;
  background-size: 42px auto;
  padding-left: 58px !important;
  background-position: 8px 0;
  background-image: url(data:image/png;base64,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)
}
`