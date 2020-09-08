import { register } from './register'
import { table } from 'console';

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

  return register(tableName, name, endpoint)
}
