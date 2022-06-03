/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Workflow } from '@data-wrangling-components/core'
import { PrepareDataFull } from '@data-wrangling-components/react'
import type { TableContainer } from '@essex/arquero'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import { cloneDeep } from 'lodash'
import type { FC } from 'react'
import { memo, useEffect, useMemo, useState } from 'react'

import { useOutput, useProjectFiles, useWorkflowState } from '~state'

interface Props {
	commandBar: IRenderFunction<IDetailsColumnProps>
}
export const PrepareData: FC<Props> = memo(function PrepareData({
	commandBar,
}) {
	const projectFiles = useProjectFiles()
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const [output, setOutput] = useOutput()
	const [wf, setWorkflow2] = useWorkflowState()
	const [workflow, setWorkflow] = useState<Workflow>(cloneDeep(wf))

	const tables = useMemo((): TableContainer[] => {
		return projectFiles.map(f => {
			return {
				id: f.name,
				name: f.name,
				table: f.table,
			} as TableContainer
		})
	}, [projectFiles])

	useEffect(() => {
		const len = output?.length ?? 0
		if (len) {
			setSelectedTableId(prev => (!prev ? output[len - 1]?.id : prev))
		} else {
			setSelectedTableId(prev => (!prev ? tables[0]?.id : prev))
		}
	}, [output, tables, setSelectedTableId])

	useEffect(() => {
		setWorkflow(cloneDeep(wf))
	}, [wf])

	return (
		<PrepareDataFull
			inputs={tables}
			derived={output}
			workflow={workflow}
			selectedTableId={selectedTableId}
			onSelectedTableIdChanged={setSelectedTableId}
			onUpdateOutput={setOutput}
			outputHeaderCommandBar={[commandBar]}
			onUpdateWorkflow={w => setWorkflow2(cloneDeep(w))}
		/>
	)
})
