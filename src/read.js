
export function read(filename)
{
	var file = new File([],filename);
	var fr=new FileReader();
	fr.readAsText(file);
}
