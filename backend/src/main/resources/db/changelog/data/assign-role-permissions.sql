INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
         JOIN permissions p ON
    (
        -- ADMIN
        (r.name = 'ADMIN')

            -- WAITER
            OR (
            r.name = 'WAITER' AND p.name IN (
                                             'UPDATE_USER',
                                             'READ_CATEGORY',
                                             'READ_PRODUCT',
                                             'READ_RESTAURANT_TABLE',
                                             'CHANGE_RESTAURANT_TABLE_STATUS',
                                             'CREATE_ORDER',
                                             'READ_ORDER',
                                             'CANCEL_ORDER'
                )
            )

            -- KITCHEN
            OR (
            r.name = 'KITCHEN' AND p.name IN (
                                              'READ_CATEGORY',
                                              'READ_PRODUCT',
                                              'TOGGLE_PRODUCT_AVAILABILITY',
                                              'READ_ORDER',
                                              'UPDATE_ORDER_ITEM_STATUS'
                )
            )

            -- CASHIER
            OR (
            r.name = 'CASHIER' AND p.name IN (
                                              'READ_PRODUCT',
                                              'READ_ORDER',
                                              'PROCESS_PAYMENT',
                                              'VIEW_DASHBOARD',
                                              'VIEW_SALES_REPORT'
                )
            )
        );
