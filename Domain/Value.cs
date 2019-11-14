namespace Domain
{
    public class Value //Note* This is an enity because we are using entity framework
    {
        public int Id { get; set; }//this is a property of an entity. because its id its a primary key

        public string Name { get; set; }
    }
}
