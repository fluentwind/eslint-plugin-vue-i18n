module.exports = {
  defineTemplateBodyVisitor(context, templateBodyVisitor, scriptVisitor) {
    if (context.parserServices.defineTemplateBodyVisitor == null) {
      return {}
    }
    return context.parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor)
  },
}
