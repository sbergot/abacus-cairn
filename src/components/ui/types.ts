export interface Children {
  children?: React.ReactNode;
}

export interface ClassName {
  className?: string;
}

export type KeyOfType<Type, ValueType> = Extract<keyof {
  [Key in keyof Type as Type[Key] extends ValueType ? Key : never]: any;
}, string>;