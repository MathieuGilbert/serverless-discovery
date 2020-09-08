import { publish } from './publish'

const tableName = process.env.TABLE_NAME!;

type Event = {
  arguments: {
    name: string,
    endpoint: string
  }
}

exports.handler = async (event: Event) => {
  console.log(event)

  const { name, endpoint } = event.arguments

  return publish(tableName, name, endpoint)
}
