module.exports = {
  COMPONENT_EMBED_REGEX: /([!]{1,2}|[$]{1,2}){(.*)}/g,
  COMPONENT_AUTOFILL_REGEX: /([!]{1,2}|[$]{1,2}){(\.\.\.autofill)}/g,
  COMPONENT_ID_REGEX: /(?<={).+?(?=})/g,
  COMPONENT_TYPE_PREVIEW: "preview",
  COMPONENT_TYPE_CODE: "code",
  H2_REGEX: /^#{2}(?!#)(.*)/gm,
  COMPONENT_OPTION_FRAMELESS: "frameless"
};
