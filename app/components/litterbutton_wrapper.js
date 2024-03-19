import ApiDataProvider from '@/app/_utils/api_provider';

import LitterButton from './litterbutton';

export default function LitterButton_Wrapper({ id }) {
    
  return (
	<ApiDataProvider>
		<LitterButton id={id}/>
	</ApiDataProvider>
  )
}