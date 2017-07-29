import { reduce } from "lodash";
export default ({...data}) => reduce(data, (input, [...items]) => ([...input, ...items]));