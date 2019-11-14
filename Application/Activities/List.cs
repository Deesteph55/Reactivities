using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List//list of activities
    {
        //we want a query and a handler for the query
        public class Query : IRequest<List<Activity>> { }

        //returning a list of activity from the handler. that is the query
        public class Handler : IRequestHandler<Query, List<Activity>>
        {//need access to datacontext in handler
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities.ToListAsync();
                return activities;
            }
        }
    }
}