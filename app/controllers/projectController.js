const { Project, Section } = require('../models');

module.exports = {

  async store(req, res, next) {
    try {
      const project = await Project.create({
        ...req.body,
        UserId: req.session.user.id,
      });

      req.flash('success', 'Projeto criado com sucesso');

      return res.redirect(`/app/projects/${project.id}`);
    } catch (err) {
      return next(err);
    }
  },

  async show(req, res, next) {
    try {
      const { projectId } = req.params;

      const project = await Project.findById(projectId);

      const sections = await Section.findAll({
        where: {
          ProjectId: projectId,
        },
      });

      let currentSection = null;
      const id = req.params.id || 0;
      if (id > 0) {
        currentSection = await Section.findById(id);
      } else {
        currentSection = (sections[0] || null);
      }

      return res.render('projects/show', { project, sections, currentSection });
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      await Project.destroy({ where: { id: req.params.projectId } });
      req.flash('success', 'Projeto removido com sucesso.');

      return res.redirect('/app/dashboard');
    } catch (err) {
      return next(err);
    }
  },
};
