// @ts-check

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type must be one of the following
    'type-enum': [
      2,
      'always',
      [
        'feat', // nueva funcionalidad
        'fix', // corrección de bug
        'refactor', // refactorización sin cambio funcional
        'perf', // mejora de rendimiento
        'style', // formato, espacios, comas (sin cambio lógico)
        'test', // añadir o corregir tests
        'docs', // cambios en documentación
        'build', // cambios en build system o dependencias
        'ci', // cambios en CI/CD
        'chore', // otras tareas (sin cambio en src o tests)
        'revert', // revertir un commit anterior
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-min-length': [2, 'always', 10],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 120],
    'body-max-line-length': [2, 'always', 200],
  },
};
