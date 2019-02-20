#include <graphenelib/system.h>
#include <graphenelib/contract.hpp>
#include <graphenelib/dispatcher.hpp>
#include <graphenelib/multi_index.hpp>
#include <graphenelib/print.hpp>
#include <graphenelib/types.h>
#include <graphenelib/global.h>

using namespace graphene;

class todolist : public contract
{
  public:
    todolist(uint64_t id)
        : contract(id),
        todos(_self, _self)
    {
    }

    /// @abi action
    void create(const std::string& description){
        uint64_t sender = get_trx_sender();
        todos.emplace(sender, [&](auto& todo){
            todo.id = todos.available_primary_key();
            todo.description = description;
            todo.completed = 0;
        });
    }
    /// @abi action
    void destory(const uint32_t id){
        auto it = todos.find(id);
        graphene_assert(it != todos.end(), "todo does not exist!");
        todos.erase(it);
        
        print("todo#", id, " destory");
    }
    /// @abi action
    void complete(const uint32_t id){
        auto it = todos.find(id);
        graphene_assert(it != todos.end(), "todo does not exist!");
        
        uint64_t sender = get_trx_sender();
        todos.modify(it,sender, [&](auto& todo){
            todo.completed = 1;
        });
        
        print("todo#", id, " complete");
    }
    
  private:
      //@abi table todo i64 
      struct todo{
          uint64_t id;
          std::string description;
          uint64_t completed;
          
          uint64_t primary_key() const {return id;}
          GRAPHENE_SERIALIZE(todo, (id)(description)(completed))
      };
      
      typedef multi_index<N(todo), todo> todo_index;
      todo_index todos;
};

GRAPHENE_ABI(todolist, (create)(complete)(destory))
