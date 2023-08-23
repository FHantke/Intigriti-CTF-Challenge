from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import cross_origin
from flask_login import login_required
from ariadne import ObjectType, make_executable_schema, graphql_sync, load_schema_from_path, snake_case_fallback_resolvers
from ariadne.explorer import ExplorerGraphiQL

from .queries import resolve_users, resolve_user, resolve_transactions, resolve_me
from .queries  import resolve_create_user, resolve_login_user, resolve_create_transaction, resolve_upgrade,resolve_user_update

main = Blueprint('main', __name__)

query = ObjectType("Query")

# We don't need the users query anymore
# query.set_field("users", resolve_users)
query.set_field("user", resolve_user)
query.set_field("me", resolve_me)
query.set_field("transactions", resolve_transactions)

mutation = ObjectType("Mutation")

mutation.set_field("signup", resolve_create_user)
mutation.set_field("signin", resolve_login_user)
mutation.set_field("createTransaction", resolve_create_transaction)
mutation.set_field("upgrade", resolve_upgrade)
mutation.set_field("user", resolve_user_update)

@query.field("hello")
def resolve_hello(_, info):
    request = info.context
    user_agent = request.headers.get("User-Agent", "Guest")
    print("return")
    return "Hello, %s!" % user_agent

type_defs = load_schema_from_path("schema.graphql")
schema = make_executable_schema(
    type_defs, query, mutation, snake_case_fallback_resolvers
)



explorer_html = ExplorerGraphiQL().html(None)

@main.route('/')
def hello():
    from .models import User
    users = [user.to_dict() for user in User.query.all()]
    print(users)
    return 'Hello!'

@login_required
@main.route('/admin')
def admin():
    from .models import User
    users = [user.to_dict() for user in User.query.all()]
    print(users)
    return 'Hello!'

@cross_origin()
@main.route("/graphql", methods=["GET"])
def graphql_playground():
    """Serve GraphiQL playground"""
    return explorer_html, 200

@cross_origin()
@main.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(schema, data, context_value=request)
    status_code = 200 if success else 400
    return jsonify(result), status_code
