class CreateTodoLists < ActiveRecord::Migration[8.1]
  def change
    create_table :todo_lists do |t|
      t.string :title, null: false
      t.text :description
      t.boolean :completed, default: false, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
