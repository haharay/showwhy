/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { wait } from '@showwhy/api-client'
import type { Definition, DefinitionType, Maybe } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'

import { withRandomId } from '~utils/ids'

export function updateListTypes(
	definitions: Maybe<Definition[]>,
	type: Maybe<DefinitionType>,
): Definition[] {
	const isPrimary = definitions?.find(
		d => d.type === type && d.level === CausalityLevel.Primary,
	)

	let result = definitions ? [...definitions] : []
	if (isPrimary) {
		result = result.map(d => {
			if (d.id === isPrimary.id) {
				return { ...d, level: CausalityLevel.Secondary }
			}
			return d
		})
	}
	return result
}

export async function saveDefinitions(
	definition: Definition | Definition[],
	definitions: Definition[],
	setDefinitions: (definitions: Definition[]) => void,
): Promise<void> {
	if (!definition) {
		return
	}
	let list = [...definitions]
	if (!Array.isArray(definition)) {
		list = [...list, withRandomId(definition)]
	} else if (definition.length) {
		list = [...definition]
	}
	setDefinitions(list)
	await wait(500)
}
