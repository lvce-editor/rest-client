import { text, VirtualDomElements, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'

export interface TreeNode {
  readonly children: readonly TreeNode[]
  readonly node: VirtualDomNode
}

export const textNode = (value: string): TreeNode => ({
  children: [],
  node: text(value),
})

export const node = (
  type: number,
  properties: Readonly<Record<string, unknown>> = {},
  children: readonly TreeNode[] = [],
): TreeNode => ({
  children,
  node: {
    ...properties,
    childCount: children.length,
    type,
  },
})

export const div = (className: string, children: readonly TreeNode[]): TreeNode =>
  node(VirtualDomElements.Div, { className }, children)

export const button = (name: string, label: string, className: string, disabled = false): TreeNode =>
  node(
    VirtualDomElements.Button,
    {
      buttonType: 'button',
      className,
      ...(disabled && { disabled: true }),
      name,
      onClick: 'handleClick',
    },
    [textNode(label)],
  )

export const input = (name: string, value: string): TreeNode =>
  node(VirtualDomElements.Input, {
    className: 'RestClientUrlInput',
    name,
    onInput: 'handleInput',
    type: 'url',
    value,
  })

export const select = (name: string, value: string, options: readonly string[]): TreeNode =>
  node(
    VirtualDomElements.Select,
    {
      className: 'RestClientMethodSelect',
      name,
    onInput: 'handleInput',
      value,
    },
    options.map((option) => node(VirtualDomElements.Option, { value: option }, [textNode(option)])),
  )

export const flatten = (tree: TreeNode): readonly VirtualDomNode[] => [tree.node, ...tree.children.flatMap(flatten)]
