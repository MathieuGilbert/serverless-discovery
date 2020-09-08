import { get } from './get'

const tableName = process.env.TABLE_NAME!;

type Event = {
  arguments: {
    name: string,
    version?: string
  }
}

exports.handler = async (event: Event) => {
  console.log(event)

  const { name, version } = event.arguments

  return get(tableName, name, version)
}
