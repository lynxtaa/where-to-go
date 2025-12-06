import eslintConfig from '@lynxtaa/eslint-config'
import eslintConfigEsm from '@lynxtaa/eslint-config/esm'
import requiresTypechecking from '@lynxtaa/eslint-config/requires-typechecking'

export default [
	...eslintConfig,
	...eslintConfigEsm,
	...requiresTypechecking,
	// See https://typescript-eslint.io/getting-started/typed-linting
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['*.js', '*.mjs'],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
]
